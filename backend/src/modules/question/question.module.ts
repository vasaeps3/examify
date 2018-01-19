import { Module } from "@nestjs/common";

import { AnswerModule } from "../answer/answer.module";
import { DatabaseConfig } from "../database/database.config";
import { DatabaseModule } from "../database/database.module";
import { QuestionService } from "./question.service";
import { DevDatabaseConfig } from "../database/dev.database.config";
import { QuestionController } from "./question.controller";


@Module({
    imports: [DatabaseModule, AnswerModule],
    controllers: [QuestionController],
    components: [
        QuestionService,
        { provide: DatabaseConfig, useClass: DevDatabaseConfig }
    ],
    exports: [QuestionService]
})
export class QuestionModule {

}