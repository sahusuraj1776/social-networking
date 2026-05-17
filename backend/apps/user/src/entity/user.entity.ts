import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../enum/gender.enum";


@Entity('users')
export class UserEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    name:string

    @Column({unique:true,nullable:false})
    email:string

    @Column({nullable:true})
    city:string

    @Column({nullable:true})
    gender:Gender

    @Column({nullable:true})
    profession:string

    @Column({nullable:true})
    profileUrl:string
}