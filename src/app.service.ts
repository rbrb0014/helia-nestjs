import { Injectable } from '@nestjs/common';
import { createHelia } from 'helia';
import type { Helia } from '@helia/interface';
import { strings, Strings } from '@helia/strings';
import { CID } from 'multiformats';
// import { ContentsDto } from './dto/contents.dto';
// import { sha256 } from 'multiformats/src/hashes/sha2';
import { MemoryBlockstore } from 'blockstore-core';

@Injectable()
export class AppService {
  private helia: Helia;
  private stringHelia: Strings;

  async getHelia(): Promise<Helia> {
    if (this.helia == null)
      this.helia = await createHelia({ blockstore: new MemoryBlockstore() });
    if (this.stringHelia == null) this.stringHelia = strings(this.helia);

    return this.helia;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop();
    }
  }

  async postStringContents(contents: string): Promise<string> {
    const myImmutableAddress = await this.stringHelia!.add(contents);

    return myImmutableAddress.toString();
  }

  // async postImgContents(contents: ContentsDto): Promise<string[]> {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const { avatar, background } = contents;
  //   return Promise.all(
  //     avatar!.map(async (file) => {
  //       const buf: Uint8Array = file.buffer;
  //       const hash = await sha256.digest(buf);
  //       const cid = CID.createV0(hash);

  //       await this.helia.blockstore.put(cid, buf);

  //       return cid.toString();
  //     }),
  //   );
  // }

  async getStringContents(cid: string): Promise<string> {
    const parsedCid = CID.parse(cid);
    const string = await this.stringHelia.get(parsedCid);
    return string;
  }

  async garbageCollect() {
    this.helia.gc();
  }
}
