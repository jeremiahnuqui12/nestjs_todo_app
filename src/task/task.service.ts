import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity/task.entity';
import validator from 'validator';

@Injectable()
export class TaskService {

    constructor(@InjectRepository(TaskEntity) private tasksRepository: Repository<TaskEntity>) { }

    async getTasks(user_id){
        // return await this.tasksRepository.find({
        //     select: ['id', 'title', 'description', "date_created"],
        //     where: [{ is_active: 1, created_by: user_id }],
        //     order: {'id': 'desc'}
        // });
        return await this.tasksRepository.query(`SELECT id, title, description, DATE_FORMAT(date_created, '%m/%d/%Y %h:%i %p') AS date_created FROM task 
            WHERE is_active=1 AND created_by="${user_id}" ORDER BY id DESC`)
    }
    async createTask(data) {
        console.log("=========CREATE")
        return await this.tasksRepository.save([
            { title: data.title, description: data.description, created_by: data.user_id},
        ])
    }
    async updateTask(data) {
        console.log("---------UPDATE")
        console.log(data)
        let tasks_update = this.tasksRepository.findOneBy({
            id: data.task_id,
        })
        await tasks_update.then(async res=>{
            res.title = data.title;
            res.description = data.description;
            return await this.tasksRepository.save(res)
        })
    }
    async deleteTask(task_id) {
        return await this.tasksRepository.query(`UPDATE task SET is_active=0
            WHERE id=${task_id}`)
    }
    validateTaskData(data) {
        const {title, description} = data;
        let error_list = [];

        if(typeof title == 'undefined'){
            error_list.push("Title is undefined");
        } else {
            validator.isEmpty(title, {ignore_whitespace: false}) ? error_list.push("Title is required") :
                // !validator.isAlphanumeric(title) ? error_list.push("Title should be alphanumeric only") :
                    title.length >=100 ? error_list.push("Title Maximum Characters is 100") : false;
        }
        if(typeof description == 'undefined'){
            error_list.push("Description is undefined");
        } else {
            validator.isEmpty(description, {ignore_whitespace: false}) ? error_list.push("Description is required") :
                description.length >=500 ? error_list.push("Description Maximum Characters is 100") : false;
        }

        return error_list;
    }


}
