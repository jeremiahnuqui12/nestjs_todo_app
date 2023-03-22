import { Controller, Get, Req, Param, Render, Post, Res, HttpStatus, Session, Redirect, Patch, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskEntity } from './task.entity/task.entity';
import { Request, Response } from 'express';

@Controller('/')
export class TaskController {

    constructor(private task_service: TaskService) { }

    @Get('/')
    @Render('index')
    todo_page(@Session() session, @Res() response: Response) {
        console.log("index")
        console.log(session.client);
        if(typeof session.client == 'undefined') {
            return response.redirect('/login')
        }
        return {data: session.client}
    }
    
    @Get('/task/data')
    allTask(@Session() session, @Req() request: Request, @Res() response: Response){
        this.task_service.getTasks(session.client.id)
        .then(json=>{
            return response.json(json);  
        })
    }

    @Post('/task/create')
    createTask(@Session() session, @Req() request: Request, @Res() response: Response){
        let validateData = this.task_service.validateTaskData(request.body);
        console.log(validateData)
        if(validateData.length){
            return response.json({status:"ERROR", description:validateData})
        }
        request.body.user_id = session.client.id;
        this.task_service.createTask(request.body)
        .then((res)=>{
            console.log("====")
            console.log(typeof res)
            if(typeof res == 'object'){
                return response.json({status:"SUCCESS", description:"Task has been created"})
            }
            return response.json({status:"FAILED", description:"MySQL ERROR"})
            
        })
    }

    @Patch('/task/update/:id')
    updateTask(@Session() session, @Req() request: Request, @Res() response: Response){
        let validateData = this.task_service.validateTaskData(request.body);
        console.log(validateData);
        if(validateData.length){
            return response.json({status:"ERROR", description:validateData})
        }
        request.body.user_id = session.client.id;
        request.body.task_id = request.params.id;
        this.task_service.updateTask(request.body)
        .then((res)=>{
            console.log("==========RESPONSE UPDATE")
            console.log(res)
            console.log("====================")
            // if(typeof res['insertId'] == 'undefined'){
            //     return response.json({status:"ERROR", description:"MySQL ERROR"})
            // }
            return response.json({status:"SUCCESS", description:"Task has been updated"})
        })
    }

    @Delete('/task/delete/:id')
    deleteTask(@Req() request: Request, @Res() response: Response){
        this.task_service.deleteTask(request.params.id)
        .then((res)=>{
            console.log(res)
            if(typeof res.insertId == 'undefined'){
                return response.json({status:"ERROR", description:"MySQL ERROR"})
            }
            return response.json({status:"SUCCESS", description:"Task has been deleted"})
        })
    }
}
