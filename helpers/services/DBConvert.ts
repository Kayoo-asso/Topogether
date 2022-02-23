import { DBUser, DBUserUpdate, User } from "types";


export class DBConvert {
    static userToDB(user: User): DBUserUpdate {
        return {
            id: user.id,
            user_name: user.pseudo,
            image_url: user.imageUrl,
            first_name: user.firstName,
            last_name: user.lastName,
            country: user.country,
            city: user.city,
            phone: user.phone,
            birth: user.birthDate?.toJSON(),
        }
    }

    static userFromDB(user: DBUser): User {
        return {
            id: user.id,
            pseudo: user.user_name,
            email: user.email,
            role: user.role,
            created: new Date(user.created),
            imageUrl: user.image_url,
            firstName: user.first_name,
            lastName: user.last_name,
            country: user.country,
            city: user.city,
            phone: user.phone,
            birthDate: user.birth ? new Date(user.birth) : undefined
        };
    }
}