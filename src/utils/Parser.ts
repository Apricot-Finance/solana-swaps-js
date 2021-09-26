
export enum FieldType {
  u8, u32, u64, f64
}
export const TYPE_TO_LENGTH: {[type in FieldType] : number} = {
  [FieldType.u8]: 1,
  [FieldType.u32]: 4,
  [FieldType.u64]: 8,
  [FieldType.f64]: 8,
}

class FieldDecl {
  constructor(
    public name: string,
    public type: FieldType,
  ) { 
  }
  getLength() {
    return TYPE_TO_LENGTH[this.type];
  }
}

export class Parser {
  fields : FieldDecl[];
  nameToField: {[name:string]: FieldDecl};
  constructor(
    fields: FieldDecl[] = []
  ) {
    this.fields = [];
    this.nameToField = {};
    fields.forEach(this.addField);
  }
  addField(field: FieldDecl) {
    if(field.name in this.nameToField) {
      throw new Error(`${field.name} already present in struct`);
    }
    this.fields.push(field);
    this.nameToField[field.name] = field;
  }
  u8(name: string) : Parser { 
    this.addField(new FieldDecl(name, FieldType.u8)); 
    return this;
  }
  u32(name: string) : Parser { 
    this.addField(new FieldDecl(name, FieldType.u32)); 
    return this;
  }
  u64(name: string) : Parser { 
    this.addField(new FieldDecl(name, FieldType.u64)); 
    return this;
  }
  f64(name: string) : Parser { 
    this.addField(new FieldDecl(name, FieldType.f64)); 
    return this;
  }

  getLength() : number {
    return this.fields.map(f=>f.getLength()).reduce((a,b)=>a+b, 0);
  }

  encode(object: any) : Buffer {
    const buffer = Buffer.alloc(this.getLength());
    //const view = new DataView(buffer);
    let offset = 0;
    for(const field of this.fields) {
      if(!(field.name in object)) {
        throw new Error(`Object does not contain ${field.name}`);
      }
      const value = object[field.name];
      if(field.type === FieldType.u8) {
        buffer.writeUInt8(value, offset);
        //view.setUint8(offset, value);
      }
      else if(field.type === FieldType.u32) {
        buffer.writeUInt32LE(value, offset);
        //view.setUint32(offset, value, true);
      }
      else if(field.type === FieldType.u64) {
        buffer.writeUInt32LE(value % 4294967296, offset);
        buffer.writeUInt32LE(value / 4294967296, offset + 4);
      }
      else if(field.type === FieldType.f64) {
        buffer.writeDoubleLE(value, offset);
      }
      else {
        throw new Error(`Unknown field type ${field.type}`);
      }

      offset += field.getLength();
    }
    return buffer;
  }
}