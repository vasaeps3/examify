import * as _ from "lodash";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Topic } from "../../../common/entity/topic.entity";
import { Answer } from "../../../common/entity/answer.entity";
import { Question } from "../../../common/entity/question.entity";
import { CommonApiService } from "../../../common/common-api.service";
import { RoutingService } from "../../../common/routing.service";


@Component({
    selector: "ex-edit-question",
    templateUrl: "./edit-question.component.html",
    styleUrls: ["./edit-question.component.scss"]
})
export class EditQuestionComponent implements OnInit {

    private topic: Topic;
    private question: Question;

    constructor(
        private commonApiService: CommonApiService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private routingService: RoutingService
    ) { }

    public ngOnInit() {
        this.question = this.activatedRoute.snapshot.data["question"] || {};
        this.topic = this.activatedRoute.snapshot.data["topic"];
    }

    private get questionsManagePageRoute() {
        return this.routingService.getQuestionsManagePage(this.topic.id);
    }

    public save() {
        let result;

        if (this.question.id) {
            result = this.commonApiService.updateQuestion({ ...this.question, id: this.question.id });
        } else {
            result = this.commonApiService.createQuestion({ ...this.question, topicId: this.topic.id });
        }

        result.subscribe(newTopic => {
            this.router.navigate(this.questionsManagePageRoute);
        });
    }

    public deleteQuestion() {
        if (confirm(`Do you really want to remove this question?`)) {
            this.commonApiService.deleteQuestion(this.question.id)
                .subscribe(() => {
                    this.router.navigate(this.questionsManagePageRoute);
                });
        }
    }

    public deleteAnswer(answer: Answer) {
        _.remove(this.question.answers, answer);
    }

    public addAnswer() {
        if (!this.question.answers) {
            this.question.answers = [];
        }

        this.question.answers.push({ text: "", isCorrect: false });
    }

}
