import { Injectable } from '@nestjs/common';
import { AccessControlContextInterface, CanAccess } from '@concepta/nestjs-access-control';

/**
 * Pet Vaccination Access Query Service
 * 
 * Implements access control for vaccination records.
 * Currently allows all authenticated users to access vaccinations.
 * 
 * TODO: Add logic to check if the vaccination's pet belongs to the user
 */
@Injectable()
export class PetVaccinationAccessQueryService implements CanAccess {
  async canAccess(context: AccessControlContextInterface): Promise<boolean> {
    // Allow access for all authenticated users
    // Add custom access control logic here as needed
    return true;
  }
}

