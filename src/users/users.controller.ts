import { Controller, Get, Req, Param, Render, Post, Res, HttpStatus, Session, Redirect, Next } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity/user.entity';
import { Response } from 'express';

@Controller('/')
export class UsersController {

    constructor(private user_service: UsersService) { }


    @Get('/test/:id')
    get(@Param() params) {
        return this.user_service.getUser(params.id);
    }

    @Get('/login')
    @Render('login')
    login_page(@Session() session, @Res() response: Response) {
        if(typeof session.client != 'undefined') {
            return response.redirect('/')
        }
        return;
    }

    @Get('/register')
    @Render('register')
    register_page(@Session() session, @Res() response: Response) {
        if(typeof session.client != 'undefined') {
            return response.redirect('/')
        }
        return;
    }

    @Post('/login')
    login(@Session() session, @Req() request: Request, @Res() response: Response) {
        console.log(request.body)
        let validation_response = this.user_service.validateCredentials(request.body);
        // let test;
        if(validation_response.length == 0) {
            this.user_service.checkUserIfExist(request.body)
            .then(json=>{
                if(json.length == 0) {
                    return response.status(HttpStatus.BAD_REQUEST).json({status:"FAILED", description:"User not found"});
                }
                session.client = json[0]
                console.log(json[0].username);
                return response.status(HttpStatus.OK).json({status:"SUCCESS", description:"Successfully logged-in"});
            })
        } else {
            return response.status(HttpStatus.BAD_REQUEST).json({status:"ERROR", description:validation_response});
        }
    }

    @Post('/register')
    register(@Session() session, @Req() request: Request, @Res() response: Response) {
        console.log(request.body)
        let validation_response = this.user_service.validateCredentials(request.body);
        // let test;
        if(validation_response.length == 0) {
            this.user_service.checkUsernameAlreadyExist(request.body)
            .then(json=>{
                if(json.length) {
                    validation_response.push("Username already exist")
                    return response.status(HttpStatus.CONFLICT).json({status:"ERROR", description:validation_response});
                }
                this.user_service.registerUser(request.body)
                .then(res=>{
                    if(typeof res['insertId'] == 'undefined'){
                        return response.json({status:"ERROR", description:"MySQL ERROR"})
                    }
                    return response.json({status:"SUCCESS", description:"Username has been registered"})
                })
            })
        } else {
            return response.status(HttpStatus.BAD_REQUEST).json({status:"ERROR", description:validation_response});
        }
    }


    @Get('/logout')
    logout(@Session() session, @Res() response: Response) {
        console.log(session.client);
        session.destroy()
        return response.redirect('/login')
    }
}
