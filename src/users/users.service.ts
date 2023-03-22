import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity/user.entity';
import validator from 'validator';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) { }

    async getUser(_id: number): Promise<UserEntity[]> {
        return await this.usersRepository.find({
            select: ['username'],
            where: [{ "id": _id }]
        });
    }
    async checkUserIfExist(data): Promise<UserEntity[]> {
        console.log(data)
        console.log("====")
        return await this.usersRepository.find({
            select: ['id', 'username', 'date_created'],
            where: [{ "username": data.username, "password": data.password}]
        });
    }
    async registerUser(data): Promise<UserEntity[]> {
      return await this.usersRepository.query(`INSERT INTO users(username, password)
        VALUES("${data.username}","${data.password}")`)
    }
    checkUsernameAlreadyExist(data) {
        console.log(data)
        console.log("====")
        return this.usersRepository.find({
            select: ['id'],
            where: [{ "username": data.username }]
        });
    }

    validateCredentials(data) {
        console.log(data)
        let error_list = new Array(); 
        if(typeof data.username == 'undefined') {
          error_list.push("Username is undefined")
        }  else if(validator.isEmpty(data.username)){
          error_list.push("Username is required");
        } else if(!validator.isAlphanumeric(data.username)){
          error_list.push("Username is invalid");
        }
        if(typeof data.password == 'undefined') {
          error_list.push("Password is undefined");
        } else if(validator.isEmpty(data.password)){
          error_list.push("Password is required");
        } else if(data.password.length < 5) {
          error_list.push("Password is too short");
        }
        return error_list;
      }

}
