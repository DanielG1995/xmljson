import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataService } from './data.service';
import { Makes } from '../makes/entities/Makes';
import { VehicleType } from '../vehicle/entities/VehicleType';
import { Repository } from 'typeorm';

const mockMakesRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockVehicleRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('DataService', () => {
  let service: DataService;
  let makeRepository: Repository<Makes>;
  let vehicleRepository: Repository<VehicleType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        {
          provide: getRepositoryToken(Makes),
          useValue: mockMakesRepository,
        },
        {
          provide: getRepositoryToken(VehicleType),
          useValue: mockVehicleRepository,
        },
      ],
    }).compile();

    service = module.get<DataService>(DataService);
    makeRepository = module.get<Repository<Makes>>(getRepositoryToken(Makes));
    vehicleRepository = module.get<Repository<VehicleType>>(getRepositoryToken(VehicleType));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loadData', () => {
    it('should transform data and save makes', async () => {
      const XMLData = `<Response xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <Count>11354</Count>
        <Message>Response returned successfully</Message>
        <Results>
          <AllVehicleMakes>
            <Make_ID>12858</Make_ID>
            <Make_Name>#1 ALPINE CUSTOMS</Make_Name>
          </AllVehicleMakes>
          <AllVehicleMakes>
            <Make_ID>4877</Make_ID>
            <Make_Name>1/OFF KUSTOMS, LLC</Make_Name>
          </AllVehicleMakes>
        </Results>
      </Response>`;
      
      const params = { skip: 0, limit: 0 };

      jest.spyOn(service, 'getVehicleTypesByMake').mockResolvedValueOnce([{typeId:2,typeName:'Passenger Car'}]);
      jest.spyOn(service, 'checkSavedVehicles').mockResolvedValueOnce([{typeId:2,typeName:'Passenger Car'}]);

      const result = await service.loadData(XMLData, params);

      expect(result).toHaveLength(2);
      expect(result[0].makeId).toBe(12858);
      expect(result[0].makeName).toBe('#1 ALPINE CUSTOMS');
      expect(result[0].vehiclesType?.[0].typeId).toBe(2);
      expect(result[0].vehiclesType?.[0].typeName).toBe('Passenger Car');
      expect(mockMakesRepository.create).toHaveBeenCalledTimes(2);
      expect(mockMakesRepository.save).toHaveBeenCalledTimes(2);
    });
  });

 
  describe('getVehicleTypesByMake', () => {
    it('should transform data and return vehicle types for a given make', async () => {
      const makes: Makes = { makeId: 12858, makeName: '#1 ALPINE CUSTOMS' };
      const xmlResponse = `<Response xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <Count>2</Count>
        <Message>Response returned successfully</Message>
        <SearchCriteria>Make ID: 12858</SearchCriteria>
        <Results>
          <VehicleTypesForMakeIds>
            <VehicleTypeId>2</VehicleTypeId>
            <VehicleTypeName>Passenger Car</VehicleTypeName>
          </VehicleTypesForMakeIds>
          <VehicleTypesForMakeIds>
            <VehicleTypeId>7</VehicleTypeId>
            <VehicleTypeName>Multipurpose Passenger Vehicle (MPV)</VehicleTypeName>
          </VehicleTypesForMakeIds>
        </Results>
      </Response>`;

      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          text: () => Promise.resolve(xmlResponse),
        })
      );

      const result = await service.getVehicleTypesByMake(makes);

      expect(result).toHaveLength(2);
      expect(result[0].typeId).toBe(2);
      expect(result[0].typeName).toBe('Passenger Car');
    });
  });

  describe('checkSavedVehicles', () => {
    it('should return all vehicles types, including new ones', async () => {
      const vehicleTypes: VehicleType[] = [
        { typeId: 2, typeName: 'Passenger Car' },
        { typeId: 7, typeName: 'Multipurpose Passenger Vehicle (MPV)' },
      ];

      mockVehicleRepository.find.mockResolvedValueOnce([{ typeId: 2, typeName: 'Passenger Car' }]);
      mockVehicleRepository.create.mockReturnValueOnce([{ typeId: 7, typeName: 'Multipurpose Passenger Vehicle (MPV)' }]);
      mockVehicleRepository.save.mockResolvedValueOnce([{ typeId: 7, typeName: 'Multipurpose Passenger Vehicle (MPV)' }]);

      const result = await service.checkSavedVehicles(vehicleTypes);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { typeId: 2, typeName: 'Passenger Car' },
        { typeId: 7, typeName: 'Multipurpose Passenger Vehicle (MPV)' },
      ]);
    });
  });
});
