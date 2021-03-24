import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      where: {
        id: user_id
      },
      relations: ['games']
    });
    return user ? user : new User();
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`select u.first_name from users u order by u.first_name asc`);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`select * from users u where upper(u.first_name) = upper('${first_name}') and upper(u.last_name) = upper('${last_name}')`);
  }
}
