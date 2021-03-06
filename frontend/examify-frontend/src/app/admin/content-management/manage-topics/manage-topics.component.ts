import { Subject } from "rxjs/Subject";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Topic } from "../../../common/entity/topic.entity";
import { CommonApiService } from "../../../common/common-api.service";
import { RoutingService } from "../../../common/routing.service";


@Component({
    selector: "ex-manage-topics",
    templateUrl: "./manage-topics.component.html",
    styleUrls: ["./manage-topics.component.scss"]
})
export class ManageTopicsComponent implements OnInit {

    private topics: Topic[];

    constructor(
        private router: Router,
        private commonApiService: CommonApiService,
        private activatedRoute: ActivatedRoute,
        private routingService: RoutingService
    ) {
    }

    public ngOnInit() {
        this.topics = this.activatedRoute.snapshot.data["topics"];
    }

    private get topicAddPageRoute() {
        return this.routingService.getTopicAddPage();
    }

    public onDelete(topic: Topic) {
        this.commonApiService.deleteTopic(topic.id)
            .subscribe(() => {
                this.fetchTopics();
            });
    }

    public fetchTopics() {
        this.commonApiService.getAllTopics()
            .subscribe(topics => {
                this.topics = topics;
            });
    }

}
