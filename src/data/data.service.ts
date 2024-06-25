import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser'
import { SearchParams, VehicleTypeInterface, XmlData } from 'src/interfaces';
import { Makes } from '../makes/schema/Makes.schema';
import { VehicleType } from '../vehicle/schema/VehicleType.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DataService {

  private currentVehiclesTypes: VehicleType[] = []

  constructor(
    @InjectModel(Makes.name) private readonly makeModel: Model<Makes>,
    @InjectModel(VehicleType.name) private readonly vehicleModel: Model<VehicleType>,
  ) { }

  async loadDataByUrl(url: string) {
    try {
      const response = await fetch(url);
      const xmlData = await response.text()
      return await this.loadData(xmlData)
    } catch (e) { }
  }

  async loadData(XMLData: string, params?: SearchParams): Promise<Makes[]> {
    try {
      let { skip = 0, limit = 0 } = params
      let data = []
      const parser = new XMLParser();
      let parsedData: XmlData = parser.parse(XMLData);
      const makes = parsedData.Response?.Results?.AllVehicleMakes
      if (limit === 0) {
        limit = makes.length;
      }
      let i = skip
      this.currentVehiclesTypes = await this.vehicleModel.find();
      for (const make of makes?.slice(+skip, +skip + limit * 1)) {
        const existingMake = (await this.makeModel.findOne({ makeId: make.Make_ID }).populate('vehiclesType').exec());
        if (existingMake) {
          data.push(existingMake)
          continue;
        }
        const vehiclesType = await this.getVehicleTypesByMake({ makeId: make.Make_ID, makeName: make.Make_Name } as Makes)
        const vehicleTypesSaved = await this.checkSavedVehicles(vehiclesType)
        data.push({ makeId: make.Make_ID, makeName: make.Make_Name, vehiclesType })
        const newMake = { makeId: make.Make_ID, makeName: make.Make_Name, vehiclesType: vehicleTypesSaved };
        console.log(newMake, i)
        await this.makeModel.create(newMake)
        i++
      }
      return data;
    } catch (error) {
      throw new Error(`Invalid format ${error}`);
    }
  }


  async getVehicleTypesByMake(makes: Makes): Promise<VehicleTypeInterface[]> {
    try {
      const parser = new XMLParser();
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${makes.makeId}?format=xml`);
      const xmlData = await response.text()
      let parsedData: XmlData = parser.parse(xmlData);
      const vehiclesTypes = parsedData.Response?.Results?.VehicleTypesForMakeIds
      if (!vehiclesTypes) return []
      if (!Array.isArray(vehiclesTypes))
        parsedData.Response.Results.VehicleTypesForMakeIds = [vehiclesTypes]
      const vehicleTypes = parsedData.Response.Results.VehicleTypesForMakeIds.map(vt => ({ typeId: vt.VehicleTypeId, typeName: vt.VehicleTypeName }))
      return vehicleTypes
    } catch (error) {
      console.log(error)
    }
  }

  async checkSavedVehicles(vehiclesType: VehicleTypeInterface[] = []): Promise<VehicleType[]> {

    const allVehicleType: VehicleType[] = []

    for (const vt of vehiclesType) {
      const currentVehicleType = this.currentVehiclesTypes.find(cvt => cvt.typeId === vt.typeId)
      if (!currentVehicleType) {
        const newVehicleType = await this.vehicleModel.create(vt)
        this.currentVehiclesTypes.push(newVehicleType)
        allVehicleType.push(newVehicleType)
      } else {
        allVehicleType.push(currentVehicleType)
      }

    }

    return allVehicleType
  }

}
