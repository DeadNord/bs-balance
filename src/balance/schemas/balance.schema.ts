import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

type balanceDocument = Balance & Document;

@Schema({ versionKey: false, timestamps: true })
class Balance {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  balance: number;
}
const balanceSchema = SchemaFactory.createForClass(Balance);

export { balanceDocument, Balance, balanceSchema };
