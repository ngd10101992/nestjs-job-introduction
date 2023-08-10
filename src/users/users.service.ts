import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/user.schema'
import mongoose, { Model } from 'mongoose'
import { genSaltSync, hashSync, compareSync } from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  hashPassword(password: string): string {
    const salt = genSaltSync(10)
    const hash = hashSync(password, salt)

    return hash
  }

  isValidPassword(password: string, hashPassword: string): boolean {
    return compareSync(password, hashPassword)
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.hashPassword(createUserDto.password)
    const user = await this.userModel.create({ ...createUserDto, password: hashPassword })
    return user
  }

  findAll() {
    return `This action returns all users`
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found user'

    return this.userModel.findOne({ _id: id })
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username })
  }

  update(updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found user'

    return this.userModel.deleteOne({ _id: id })
  }
}
