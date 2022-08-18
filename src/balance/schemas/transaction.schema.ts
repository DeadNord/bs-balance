import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

type transactionDocument = Transaction & Document;

@Schema({ versionKey: false, timestamps: true })
class Transaction {
  @Prop({ required: true })
  from: string;
  @Prop({ required: true })
  to: string;
  @Prop({ required: true })
  value: number;
  @Prop({ required: true })
  balance: number;
  @Prop({ required: true })
  date: string;
  @Prop()
  comment: string;
}
const transactionSchema = SchemaFactory.createForClass(Transaction);

export { transactionDocument, Transaction, transactionSchema };
