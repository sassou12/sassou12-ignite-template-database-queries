import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('game')
      .where('upper(game.title) like upper(:title)', {title: `%${param}%`}).getMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('select count(1) from games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const {users} = await this.repository
    .createQueryBuilder('game').where('game.id = :id', { id})
    .leftJoinAndSelect('game.users', 'users').getOneOrFail();
    return users;
  }
}
