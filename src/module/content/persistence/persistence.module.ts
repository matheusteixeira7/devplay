import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@src/shared/module/config/config.module';
import { EventEmitterModule } from '@src/shared/module/event/event-emitter.module';
import { TypeOrmPersistenceModule } from '@src/shared/module/persistence/typeorm/typeorm-persistence.module';
import { Content } from './entity/content.entity';
import { Episode } from './entity/episode.entity';
import { Movie } from './entity/movie.entity';
import { Thumbnail } from './entity/thumbnail.entity';
import { TvShow } from './entity/tv-show.entity';
import { Video } from './entity/video.entity';
import { ContentRepository } from './repository/content.repository';
import { MovieRepository } from './repository/movie.repository';
import { VideoRepository } from './repository/video.repository';

@Module({})
export class PersistenceModule {
  static forRoot(opts?: { migrations?: string[] }): DynamicModule {
    const { migrations } = opts || {};
    return {
      module: PersistenceModule,
      imports: [
        TypeOrmPersistenceModule.forRoot({
          migrations,
          entities: [Content, Movie, Thumbnail, Video, TvShow, Episode],
        }),
        EventEmitterModule,
        ConfigModule.forRoot(),
      ],
      providers: [ContentRepository, MovieRepository, VideoRepository],
      exports: [ContentRepository, MovieRepository, VideoRepository],
    };
  }
}
