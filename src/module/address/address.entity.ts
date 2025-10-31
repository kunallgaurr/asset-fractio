import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum AddressType {
    PERMANENT = 'PERMANENT',
    CURRENT = 'CURRENT',
    OFFICE = 'OFFICE',
    BILLING = 'BILLING',
    SHIPPING = 'SHIPPING'
}


export enum IndianState {
    ANDHRA_PRADESH = 'ANDHRA PRADESH',
    ARUNACHAL_PRADESH = 'ARUNACHAL PRADESH',
    ASSAM = 'ASSAM',
    BIHAR = 'BIHAR',
    CHHATTISGARH = 'CHHATTISGARH',
    GOA = 'GOA',
    GUJARAT = 'GUJARAT',
    HARYANA = 'HARYANA',
    HIMACHAL_PRADESH = 'HIMACHAL PRADESH',
    JHARKHAND = 'JHARKHAND',
    KARNATAKA = 'KARNATAKA',
    KERALA = 'KERALA',
    MADHYA_PRADESH = 'MADHYA PRADESH',
    MAHARASHTRA = 'MAHARASHTRA',
    MANIPUR = 'MANIPUR',
    MEGHALAYA = 'MEGHALAYA',
    MIZORAM = 'MIZORAM',
    NAGALAND = 'NAGALAND',
    ODISHA = 'ODISHA',
    PUNJAB = 'PUNJAB',
    RAJASTHAN = 'RAJASTHAN',
    SIKKIM = 'SIKKIM',
    TAMIL_NADU = 'TAMIL NADU',
    TELANGANA = 'TELANGANA',
    TRIPURA = 'TRIPURA',
    UTTAR_PRADESH = 'UTTAR PRADESH',
    UTTARAKHAND = 'UTTARAKHAND',
    WEST_BENGAL = 'WEST BENGAL',
    ANDAMAN_AND_NICOBAR = 'ANDAMAN AND NICOBAR',
    CHANDIGARH = 'CHANDIGARH',
    DADRA_AND_NAGAR_HAVELI = 'DADRA AND NAGAR HAVELI',
    DAMAN_AND_DIU = 'DAMAN AND DIU',
    DELHI = 'DELHI',
    JAMMU_AND_KASHMIR = 'JAMMU AND KASHMIR',
    LADAKH = 'LADAKH',
    LAKSHADWEEP = 'LAKSHADWEEP',
    PUDUCHERRY = 'PUDUCHERRY'
}

@Entity('address')
export class AddressEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int',
        unsigned: true
    })
    id: number;

    @Column({
        name: 'user_id',
        type: 'int',
        unsigned: true
    })
    userId: number;

    @Column({
        name: 'address_type',
        type: 'enum',
        enum: AddressType,
        default: AddressType.CURRENT
    })
    addressType: AddressType;

    @Column({
        name: 'is_primary',
        type: 'boolean',
        default: false
    })
    isPrimary: boolean;

    // Indian Address Structure
    @Column({
        name: 'house_number',
        type: 'varchar',
        length: 50,
        nullable: true
    })
    houseNumber: string;

    @Column({
        name: 'building_name',
        type: 'varchar',
        length: 100,
        nullable: true
    })
    buildingName: string;

    @Column({
        name: 'street_name',
        type: 'varchar',
        length: 200,
        nullable: true
    })
    streetName: string;

    @Column({
        name: 'area',
        type: 'varchar',
        length: 100,
        nullable: true
    })
    area: string;

    @Column({
        name: 'landmark',
        type: 'varchar',
        length: 200,
        nullable: true
    })
    landmark: string;

    @Column({
        name: 'city',
        type: 'varchar',
        length: 100,
        nullable: false
    })
    city: string;

    @Column({
        name: 'state',
        type: 'enum',
        enum: IndianState,
        nullable: false
    })
    state: IndianState;

    @Column({
        name: 'pin_code',
        type: 'varchar',
        length: 6,
        nullable: false
    })
    pinCode: string;

    @Column({
        name: 'country',
        type: 'varchar',
        length: 50,
        default: 'India'
    })
    country: string;

    @CreateDateColumn({
        name: 'created_at',
        default: new Date()
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        default: new Date()
    })
    updatedAt: Date;
}
