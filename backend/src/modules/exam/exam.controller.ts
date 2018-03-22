import { ParseIntPipe } from "@nestjs/common/pipes";
import { Response, Request } from "express";
import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, Query } from "@nestjs/common";

import { Topic } from "../topic/topic.entity";
import { ExamService } from "./exam.service";
import { ExamResult } from "./exam.types";
import { Exam } from "./exam.entity";


@Controller("exam")
export class ExamController {

    public constructor(
        protected examService: ExamService) {
    }

    @Get("start")
    public async startExamByTopic( @Req() req: Request, @Res() res: Response, @Query("topicId", new ParseIntPipe()) topicId: number) {
        let exam: Exam = await this.examService.startExam(topicId, req["token"]);

        console.warn(">>> exam", exam);

        res.status(HttpStatus.OK).json(exam);
    }

    @Post("finish")
    public async checkExam( @Req() req: Request, @Body() exam: Exam, @Res() res: Response) {
        let examResult: ExamResult = await this.examService.finishExam(exam, req["token"]);

        console.warn(">>> examResult", examResult);

        res.status(HttpStatus.OK).json(examResult);
    }

}
