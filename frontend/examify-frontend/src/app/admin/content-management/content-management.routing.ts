import { Routes, RouterModule } from "@angular/router";

import { TopicResolver } from "../../common/resolvers/topic.resolver";
import { QuestionResolver } from "../../common/resolvers/question.resolver";
import { AllTopicsResolver } from "../../common/resolvers/all-topics.resolver";
import { EditTopicComponent } from "./edit-topic/edit-topic.component";
import { EditQuestionComponent } from "./edit-question/edit-question.component";
import { ManageTopicsComponent } from "./manage-topics/manage-topics.component";
import { ManageQuestionsComponent } from "./manage-questions/manage-questions.component";
import { QuestionsByTopicResolver } from "../../common/resolvers/questions-by-topic.resolver";


const routes: Routes = [
    {
        path: "topics",
        component: ManageTopicsComponent,
        resolve: {
            topics: AllTopicsResolver
        }
    },
    {
        path: "topic/new",
        component: EditTopicComponent
    },
    {
        path: "topic/:topicId",
        component: EditTopicComponent,
        pathMatch: "full",
        resolve: {
            topic: TopicResolver
        }
    },
    {
        path: "topic/:topicId/questions",
        component: ManageQuestionsComponent,
        resolve: {
            topic: TopicResolver,
            questions: QuestionsByTopicResolver
        }
    },
    {
        path: "topic/:topicId/question/new",
        component: EditQuestionComponent,
        resolve: {
            topic: TopicResolver
        }
    },
    {
        path: "topic/:topicId/question/:questionId",
        component: EditQuestionComponent,
        resolve: {
            topic: TopicResolver,
            question: QuestionResolver
        }
    },
    {
        path: "",
        pathMatch: "full",
        redirectTo: "/admin/content-management/topics"
    }
];

export const routing = RouterModule.forChild(routes);
