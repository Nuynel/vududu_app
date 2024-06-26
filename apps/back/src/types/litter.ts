import {ObjectId, WithId} from "mongodb";

// если пользователь получил помет от суки а затем продал её, как учтем? в таком случае помет же так и остался за пользователем, хотя собаки ему не принадлежат

// помет может добавить любой зарегистрированный пользователь, как и собаку к нему, но, есть галочки с верификацией
// если помет добавлен собственно организацией или владельцем суки / кобеля, то помет считается верифицированным
// (что насчет уровней верефикации, когда помет подтвержден только частью заинтересованных лиц?)
// пока что схема простая: если помет добавлен владельцем кобеля / суки / организацией, то ему присваивается статус verified: true
// в будущем верификация будет из двух-трех заинтересованных сторон, то есть в перспективе verified будет объектом
// если помет или собака к нему добавлен сторонним пользователем, то ставится знако вопроса на месте галочки и появляется всплывашка "не верифицировано"
// нужно добавить поля с количеством щенков каждого пола, чтобы при заполнении потом не приписывались случайные собаки


export type DatabaseLitter = {
  creatorProfileId: ObjectId;

  federationId: ObjectId | null;

  fatherId: ObjectId;
  motherId: ObjectId;
  litterTitle: string;
  breedId: ObjectId | null;
  dateOfBirth: string;
  comments: string | null;
  puppyIds: ObjectId[];

  puppiesCount: {
    male: number | null
    female: number | null
  }
  verified: {
    status: boolean
  }
}

export type ClientLitter = WithId<DatabaseLitter> & {
  fatherFullName: string;
  motherFullName: string;
  puppiesData: {
    id: string,
    name: string | null,
    fullName: string,
    status: boolean,
  }[]
}

export type RawLitterData = Pick<DatabaseLitter, 'dateOfBirth' | 'comments' | 'litterTitle'> & {
  fatherId: string;
  motherId: string;
  breedId: string | null;
  puppyIds: string[];
}
