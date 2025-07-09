"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsService = void 0;
const blogs_repository_1 = require("../repositories/blogs.repository");
const domain_error_1 = require("../../core/errors/domain.error");
exports.blogsService = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repository_1.blogsRepository.findMany(queryDto);
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repository_1.blogsRepository.findByIdOrFail(id);
        });
    },
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
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
            return blogs_repository_1.blogsRepository.create(newDriver);
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield blogs_repository_1.blogsRepository.update(id, dto);
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeRide = yield blogs_repository_1.blogsRepository.findActiveRideByDriverId(id);
            if (activeRide) {
                throw new domain_error_1.DomainError(`Driver has an active ride. Complete or cancel the ride first`, DriverErrorCode.HasActiveRide);
            }
            yield blogs_repository_1.blogsRepository.delete(id);
            return;
        });
    },
};
