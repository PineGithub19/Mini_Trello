import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { ListMapper } from './mappers/list.mapper';
import { ListException } from 'src/common/exceptions/list.exception';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
    constructor(
        @InjectRepository(List)
        private listRepository: Repository<List>,
    ) { }

    async findAll(projectId: string) {
        const lists = await this.listRepository.find({ where: { projectId } });

        if (!lists)
            throw new ListException('Lists not found', 404);

        return ListMapper.toResponseList(lists);
    }

    async findOne(id: string) {
        const list = await this.listRepository.findOne({ where: { id } });

        if (!list)
            throw new ListException('List not found', 404);

        return ListMapper.toResponse(list);
    }

    async create(createListDto: CreateListDto) {
        const list = this.listRepository.create(createListDto);
        const lastPosition = await this.listRepository.findOne({
            where: { projectId: createListDto.projectId },
            order: { position: 'DESC' }
        });
        list.position = lastPosition ? lastPosition.position + 1 : 0;
        return this.listRepository.save(list);
    }

    async update(id: string, updateListDto: UpdateListDto) {
        const list = await this.listRepository.findOne({ where: { id } });
        if (!list)
            throw new ListException('List not found', 404);
        return this.listRepository.update(id, updateListDto);
    }

    async delete(id: string) {
        const list = await this.listRepository.findOne({ where: { id } });
        if (!list)
            throw new ListException('List not found', 404);
        return this.listRepository.delete(id);
    }
}
