import { blogsRepository } from '../repositories/blogs.repository';
import { WithId } from 'mongodb';
import { Blog } from '../domain/blog';
import { DomainError } from '../../core/errors/domain.error';
import { BlogQueryInput } from '../routers/input/blog-query.input';


export const blogsService = {


    async findMany( queryDto: BlogQueryInput)
        : Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        return blogsRepository.findMany(queryDto);
    },

    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        return blogsRepository.findByIdOrFail(id);
    },

    async create(dto: DriverAttributes): Promise<string> {
        const newBlog: Blog = {
            name: dto.name,
            phoneNumber: dto.phoneNumber,
            email: dto.email,
            vehicle: {
                make: dto.vehicleMake,
                model: dto.vehicleModel,
                year: dto.vehicleYear,
                licensePlate: dto.vehicleLicensePlate,
                description: dto.vehicleDescription,
                features: dto.vehicleFeatures,
            },
            createdAt: new Date(),
        };

        return blogsRepository.create(newDriver);
    },

    async update(id: string, dto: DriverAttributes): Promise<void> {
        await blogsRepository.update(id, dto);
        return;
    },

    async delete(id: string): Promise<void> {
        const activeRide = await blogsRepository.findActiveRideByDriverId(id);

        if (activeRide) {
            throw new DomainError(
                `Driver has an active ride. Complete or cancel the ride first`,
                DriverErrorCode.HasActiveRide,
            );
        }

        await blogsRepository.delete(id);
        return;
    },
};
