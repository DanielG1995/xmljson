import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XMLParser } from 'fast-xml-parser'
import { SearchParams, XmlData } from 'src/interfaces';
import { Makes } from '../makes/entities/Makes';
import { VehicleType } from '../vehicle/entities/VehicleType';
import { Repository } from 'typeorm';

@Injectable()
export class DataService {

  constructor(
    @InjectRepository(Makes)
    private readonly makeRepository: Repository<Makes>,
    @InjectRepository(VehicleType)
    private readonly vehicleRepository: Repository<VehicleType>
  ) { }

  async loadData(XMLData: string, params: SearchParams): Promise<Makes[]> {
    try {
      let { skip = 0, limit = 0 } = params

      console.log(limit, skip)

      let data = []
      const parser = new XMLParser();
      let parsedData: XmlData = parser.parse(XMLData);
      const makes = parsedData.Response?.Results?.AllVehicleMakes
      if (limit === 0) {
        limit = makes.length - 1;
      }
      let i = skip
      for (const make of parsedData.Response.Results?.AllVehicleMakes?.slice(+skip, +skip + limit * 1)) {
        const newMake = { makeId: make.Make_ID, makeName: make.Make_Name }
        const vehicleTypes = await this.getVehicleTypesByMake(newMake)
        const vehicleTypesSaved = await this.checkSavedVehicles(vehicleTypes)
        const makeToSave = this.makeRepository.create({ ...newMake, vehiclesType: vehicleTypesSaved })
        data.push(makeToSave)
        console.log(makeToSave, i++)
        await this.makeRepository.save(makeToSave)
      }
      return data;
    } catch (error) {
      throw new Error(`Invalid format ${error}`);
    }
  }


  async loadDataPromises(XMLData: string, params: SearchParams): Promise<{ data: Makes[], length: number }> {
    try {
      let { skip = 0, limit = 0 } = params

      console.log(limit, skip)

      let data = []
      const parser = new XMLParser();
      let parsedData: XmlData = parser.parse(XMLData);
      const makes = parsedData.Response?.Results?.AllVehicleMakes
      if (limit === 0) {
        limit = makes.length
      }
      for (let i = skip; i < limit; i = Math.min(i + 50, makes.length-1)) {
        const newMakes = makes.slice(i, i + 50).map(make => ({ makeId: make.Make_ID, makeName: make.Make_Name }))
        const VehicleTypesPromises = await Promise.all([...newMakes.map(newMake => this.getVehicleTypesByMake(newMake))])
        const vehicleTypesSavedPromises = await Promise.all([...VehicleTypesPromises.map(vehicleTypes => this.checkSavedVehicles(vehicleTypes))])
        const makeToSaveArr = []
        vehicleTypesSavedPromises.forEach(((vt, index) => {
          makeToSaveArr.push(this.makeRepository.create({ ...newMakes?.[index], vehiclesType: vt }))
        }
        ))
        data.push(...makeToSaveArr)
        await Promise.all([...makeToSaveArr.map(mk => this.makeRepository.save(mk))])
        console.log(makeToSaveArr, i)
      }
      return { data, length: data.length };
    } catch (error) {
      throw new Error(`Invalid format ${error}`);
    }
  }


  async getVehicleTypesByMake(makes: Makes): Promise<VehicleType[]> {
    try {
      const parser = new XMLParser();
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${makes.makeId}?format=xml`);
      const xmlData = await response.text()
      let parsedData: XmlData = parser.parse(xmlData);
      const vehiclesTypes = parsedData.Response?.Results?.VehicleTypesForMakeIds
      if (!vehiclesTypes) return []
      if (!Array.isArray(vehiclesTypes))
        parsedData.Response.Results.VehicleTypesForMakeIds = [vehiclesTypes]

      return parsedData.Response.Results.VehicleTypesForMakeIds.map(vt => ({ typeId: vt.VehicleTypeId, typeName: vt.VehicleTypeName }))

    } catch (error) {
      console.log(error)
    }
  }

  async checkSavedVehicles(vehiclesType: VehicleType[]): Promise<VehicleType[]> {

    const existingVehicleTypes = await this.vehicleRepository.find({
      where: vehiclesType.map(type => ({ typeId: type.typeId })),
    });
    const newVehicleTypes = vehiclesType.filter(
      type => !existingVehicleTypes.some(existingType => existingType.typeId === type.typeId),
    );
    const newVehicleTypesEntities = this.vehicleRepository.create(newVehicleTypes);
    await this.vehicleRepository.save(newVehicleTypesEntities);
    const allVehicleTypes = [...existingVehicleTypes, ...newVehicleTypesEntities];
    return allVehicleTypes
  }


}
