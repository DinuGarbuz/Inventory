import { Entity, MongoEntity, SerializedPrimaryKey, PrimaryKey, Property } from "mikro-orm";
import { ObjectId } from "mongodb";

@Entity()
export class AJson implements MongoEntity<AJson> {
    @PrimaryKey()
    _id!: ObjectId;

    @SerializedPrimaryKey()
    id!: string;

    @Property()
    key1!: string;

    @Property()
    "key 2"!: string;

    constructor(model?: Partial<AJson>) {
        if (!model || !(model instanceof Object))
            model = <AJson><any>{};

        this.key1 = model.key1 || "value 1";
        this["key 2"] = model["key 2"] || "value 2";
    }
}