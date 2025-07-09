import { Blog } from '../domain/blog';
import { blogCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { BlogQueryInput } from '../routers/input/blog-query.input';

export const blogsRepository = {
    async findMany(
        queryDto: BlogQueryInput,
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchDriverNameTerm,
            searchDriverEmailTerm,
            searchVehicleMakeTerm,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchDriverNameTerm) {
            filter.name = { $regex: searchDriverNameTerm, $options: 'i' };
        }

        if (searchDriverEmailTerm) {
            filter.email = { $regex: searchDriverEmailTerm, $options: 'i' };
        }

        if (searchVehicleMakeTerm) {
            filter['vehicle.make'] = { $regex: searchVehicleMakeTerm, $options: 'i' };
        }

        const items = await blogCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await blogCollection.countDocuments(filter);

        return { items, totalCount };
    },

    async findById(id: string): Promise<WithId<Blog> | null> {
        return blogCollection.findOne({ _id: new ObjectId(id) });
    },

    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        const res = await blogCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError('Driver not exist');
        }
        return res;
    },

    async create(newDriver: Blog): Promise<string> {
        const insertResult = await blogCollection.insertOne(newDriver);

        return insertResult.insertedId.toString();
    },

    async update(id: string, dto: DriverAttributes): Promise<void> {
        const updateResult = await blogCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
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
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError('Driver not exist');
        }

        return;
    },

    async delete(id: string): Promise<void> {
        const deleteResult = await blogCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Driver not exist');
        }

        return;
    },
};
