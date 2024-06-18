import { Makes } from '../makes/entities/Makes';
import { DataService } from './data.service';
import { Repository } from 'typeorm';
import { VehicleType } from '../vehicle/entities/VehicleType';

// Mock de Repository
const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('DataService', () => {
  let dataService: DataService;
  let makeRepository: Repository<Makes>;
  let vehicleRepository: Repository<VehicleType>;

  beforeEach(() => {
    makeRepository = mockRepository() as unknown as Repository<Makes>;
    vehicleRepository = mockRepository() as unknown as Repository<VehicleType>;
    dataService = new DataService(makeRepository, vehicleRepository);
  });

  it('should load data with default params', async () => {
    // Mock de XMLData y params
    const XMLData = `
      <Response>
        <Count>5</Count>
        <Message>Response returned successfully</Message>
        <Results>
          <AllVehicleMakes>
            <Make_ID>1</Make_ID>
            <Make_Name>Make 1</Make_Name>
          </AllVehicleMakes>
          <AllVehicleMakes>
            <Make_ID>2</Make_ID>
            <Make_Name>Make 2</Make_Name>
          </AllVehicleMakes>
        </Results>
      </Response>
    `;
    const params = {};

    const getVehicleTypesByMakeMock = jest.fn().mockResolvedValue([
      { typeId: 2, typeName: 'Passenger Car' },
      { typeId: 7, typeName: 'Multipurpose Passenger Vehicle (MPV)' }
    ]);
    const checkSavedVehiclesMock = jest.fn().mockImplementation(vehicleTypes => vehicleTypes);

    makeRepository.create = jest.fn().mockImplementation(make => make);
    makeRepository.save = jest.fn().mockImplementation(make => Promise.resolve(make));

    const result = await dataService.loadData(XMLData, params);

    expect(result).toHaveLength(2); 
    expect(getVehicleTypesByMakeMock).toHaveBeenCalledTimes(2); 
    expect(checkSavedVehiclesMock).toHaveBeenCalledTimes(2); 
    expect(makeRepository.create).toHaveBeenCalledTimes(2); 
    expect(makeRepository.save).toHaveBeenCalledTimes(2); 
  });

});
