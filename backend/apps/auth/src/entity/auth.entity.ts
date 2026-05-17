
import * as bcrypt from "bcrypt";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SALT_OR_ROUNDS } from "../config";
import { Role } from "../enum/role.enum";

@Entity({name:'auths'})
export class Auth{
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true,nullable:false})
    email:string

    @Column({nullable:false})
    password:string

    @Column({default:Role.User,nullable:false})
    role:Role

    @BeforeInsert()
    async hashPassowrd(){
        this.password = await bcrypt.hash(this.password,SALT_OR_ROUNDS)
    }
}