import { Column, PrimaryGeneratedColumn, Entity, Unique, JoinColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { CBaseEntities } from "./CBase.entities";
import { UserEntities } from "./User.entities";

@Entity({ name: 'logins' })
@Unique(['username'])  
@Unique(['email'])    
export class CLoginEntities extends CBaseEntities {
    
    // Primary key for the login entity
    @PrimaryGeneratedColumn({ name: 'login_id' })
    loginId: number;

    @Column({ name: 'username', type: 'varchar', length: 50, nullable: false })
    username: string;

    @Column({ name: 'email', type: 'varchar', length: 100, nullable: false })
    email: string;

    @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
    password: string;

    // Role field that accepts any string value (admin, super admin, shop_user, etc.)
    @Column({ name: 'role', type: 'varchar', length: 50, nullable: false })
    role: string;

    // Account status to enable/disable user accounts
    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;

    // Add userId field here
    @Column({ name: 'user_id', type: 'varchar', length: 50, nullable: false })
    userId: string;  // Or any suitable data type if needed

    @Column({ name: 'mobile_number', type: 'varchar', length: 20, nullable: false })
    mobileNumber: string;

    @CreateDateColumn({ type: "timestamp" })
    login_time: Date;

    @Column({ type: "timestamp", nullable: true })
    logout_time: Date | null; // Add this column

  

}































// import { Column, PrimaryGeneratedColumn, Entity, Unique } from "typeorm";
// import { CBaseEntities } from "./CBase.entities";

// @Entity({ name: 'logins' })
// @Unique(['username'])  
// @Unique(['email'])    
// export class CLoginEntities extends CBaseEntities {
//     // Primary key for the login entity
//     @PrimaryGeneratedColumn({ name: 'login_id' })
//     loginId: number;

//     @Column({ name: 'username', type: 'varchar', length: 50, nullable: false })
//     username: string;

//     @Column({ name: 'email', type: 'varchar', length: 100, nullable: false })
//     email: string;

//     @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
//     password: string;

//     // Role field that accepts any string value (admin, super admin, shop_user, etc.)
//     @Column({ name: 'role', type: 'varchar', length: 50, nullable: false })
//     role: string;

//     // Account status to enable/disable user accounts
//     @Column({ name: 'is_active', type: 'boolean', default: true })
//     isActive: boolean;
//     userId: string; 
//   mobileNumber: string;
// }
