import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DataService } from './data.service';
import { Makes } from '../makes/schema/makes.schema';
import { VehicleType } from '../vehicle/schema/VehicleType.schema';
import { Model } from 'mongoose';

describe('DataService', () => {
  let service: DataService;
  let makesModel: Model<Makes>;
  let vehicleModel: Model<VehicleType>;

  const mockMakesModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockVehicleModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        {
          provide: getModelToken(Makes.name),
          useValue: mockMakesModel,
        },
        {
          provide: getModelToken(VehicleType.name),
          useValue: mockVehicleModel,
        },
      ],
    }).compile();

    service = module.get<DataService>(DataService);
    makesModel = module.get(getModelToken(Makes.name));
    vehicleModel = module.get(getModelToken(VehicleType.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load data from XML correctly and create new makes', async () => {
    const XMLData = `<Response xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <Count>2</Count>
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

    mockVehicleModel.find.mockResolvedValueOnce([]);
    mockMakesModel.findOne.mockResolvedValueOnce(null);

    jest.spyOn(service, 'getVehicleTypesByMake').mockResolvedValueOnce([{ typeId: 2, typeName: 'Passenger Car' }]);
    jest.spyOn(service, 'checkSavedVehicles').mockResolvedValueOnce([{ typeId: 2, typeName: 'Passenger Car' } as VehicleType]);

    mockMakesModel.create.mockImplementationOnce((newMake) => {
      return { ...newMake, _id: 'mocked_id' } as any
    });

    const result = await service.loadData(XMLData, params);

    expect(result).toHaveLength(2);
    expect(result[0].makeId).toBe(12858);
    expect(result[0].makeName).toBe('#1 ALPINE CUSTOMS');
    expect(result[0].vehiclesType?.length).toBe(1);
    expect(result[0].vehiclesType?.[0].typeId).toBe(2);
    expect(result[0].vehiclesType?.[0].typeName).toBe('Passenger Car');
    expect(mockMakesModel.create).toHaveBeenCalledTimes(2);
  });

  it('should handle existing makes and skip them', async () => {
    const XMLData = `<Response xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <Count>2</Count>
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

    mockVehicleModel.find.mockResolvedValueOnce([]);
    mockMakesModel.findOne.mockResolvedValueOnce({ makeId: 12858, makeName: '#1 ALPINE CUSTOMS' } as Makes);

    jest.spyOn(service, 'getVehicleTypesByMake').mockResolvedValueOnce([{ typeId: 2, typeName: 'Passenger Car' }]);
    jest.spyOn(service, 'checkSavedVehicles').mockResolvedValueOnce([{ typeId: 2, typeName: 'Passenger Car' } as VehicleType]);

    mockMakesModel.create.mockImplementationOnce((newMake) => {
      return { ...newMake, _id: 'mocked_id' } as any;
    });

    const result = await service.loadData(XMLData, params);

    expect(result).toHaveLength(1);
    expect(result[0].makeId).toBe(4877);
    expect(mockMakesModel.create).toHaveBeenCalledTimes(1);
  });

  it('should throw an error for invalid XML', async () => {
    const XMLData = `<InvalidXML></InvalidXML>`;
    const params = { skip: 0, limit: 0 };

    await expect(service.loadData(XMLData, params)).rejects.toThrow('Invalid format');
  });
});
