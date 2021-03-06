import * as _ from "lodash";
import * as bcrypt from "bcrypt";
import * as Bluebird from "bluebird";
import { Component } from "@nestjs/common";
import { Repository, Transaction, TransactionRepository } from "typeorm";

import { User } from "./user.entity";
import { Role } from "../roles/role.entity";
import { Service } from "../../common/service.interface";
import { ServiceBase } from "../../common/base.service";
import { DatabaseService } from "../database/database.service";
import { UserNotFoundException } from "./user.not-found.exception";


@Component()
export class UserService extends ServiceBase<User> implements Service<User> {

    constructor(private databaseService: DatabaseService) {
        super();
    }

    protected get repository(): Repository<User> {
        return this.databaseService.getRepository(User);
    }

    public async getByName(name: string): Promise<User> {
        if (!name) {
            throw new UserNotFoundException();
        }

        let user: User = await this.repository.findOne({ name });

        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    public async add(user: User): Promise<User> {
        if (user.password) {
            user.password = await this.encryptPassword(user.password);
        }

        return super.add(user);
    }

    public async getById(id: number, options?: { repository: Repository<User> }): Promise<User> {
        let repository: Repository<User> = options && options.repository || this.repository;

        let user: User = await repository.findOneById(id);

        user = _.omit(user, "password") as User;

        return user;
    }

    public async getAll(): Promise<User[]> {
        let users: User[] = await super.getAll();

        return _.map(users, user => _.omit(user, ["password"]) as User);
    }

    public async getAllWithRoles(): Promise<User[]> {
        let users: User[] = await this.repository.createQueryBuilder("user")
            .leftJoinAndSelect("user.roles", "role")
            .getMany();

        return _.map(users, user => _.omit(user, ["password"]) as User);
    }

    public async getRolesByUserId(userId: number): Promise<Role[]> {
        let user: User = await this.repository
            .createQueryBuilder("user")
            .where("user.id=:userId")
            .leftJoinAndSelect("user.roles", "roles")
            .setParameter("userId", userId)
            .getOne();

        if (!user) {
            throw new UserNotFoundException();
        }

        return user.roles;
    }

    private async encryptPassword(password): Promise<string> {
        return bcrypt.hash(password, 10);
    }

}
