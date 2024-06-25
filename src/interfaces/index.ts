import { Makes } from "src/makes/schema/Makes.schema";

export interface XmlData {
    Response: Response;
}

export interface Response {
    Count: number;
    Message: string;
    Results: Results;
}

export interface Results {
    AllVehicleMakes: AllVehicleMake[];
}

export interface AllVehicleMake {
    Make_ID: number;
    Make_Name: string;
}

export interface XmlVehicleType {
    Response: Response;
}

export interface Response {
    Count: number;
    Message: string;
    SearchCriteria: string;
    Results: Results;
}

export interface Results {
    VehicleTypesForMakeIds: VehicleTypesForMakeIDS[];
}

export interface VehicleTypesForMakeIDS {
    VehicleTypeId: number;
    VehicleTypeName: string;
    make: Makes
}

export interface SearchParams {
    limit?: number,
    skip?: number
}

export interface VehicleTypeInterface {
    typeId: number,
    typeName: string
}

export interface MakesInterface {
    makeId: number,
    makeName: string
}

