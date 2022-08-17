import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { v4 } from 'uuid';

type balanceDocument = Balance & Document;

@Schema({ versionKey: false, timestamps: true })
class Balance {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  balance: number;

  @Prop(
    raw([
      {
        // id: { type: String, required: true, default: v4() },

        from: { type: String, required: true },

        to: { type: String, required: true },

        value: { type: Number, required: true },

        date: { type: String, required: true },

        comment: { type: String },
      },
    ]),
  )
  transactions: Record<string, any>;
}
const balanceSchema = SchemaFactory.createForClass(Balance);

export { balanceDocument, Balance, balanceSchema };
