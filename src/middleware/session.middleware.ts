// import { Session } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'
export function simpleFunc(req: Request, res: Response, next: NextFunction) {
  if(typeof req.session['client'] == 'undefined'){
    return res.redirect('/login')
  }
  return next();
} 
