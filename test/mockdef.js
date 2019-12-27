import { expect } from 'chai';
import mockfs from 'mock-fs';
import { MockResponseDef, file } from '../src/mockdef';

describe('MockResponseDef', ()=>{

  describe('content', ()=>{
    describe('inline contents', ()=>{
      it('simple use', ()=>{
        var def = new MockResponseDef();
        def.content = "user_id = ${ params.userId }. OK?";
        expect(def.content('/users/3939', {userId:'39'}, {})).to.be.equal("user_id = 39. OK?");
      });
    });

    describe('file contents', ()=>{
      beforeEach(()=>{
        mockfs({'/testfile':'{"user_id": ${params.userId}, "user_name": "${params.userName}"}'});
      });
      afterEach(()=>{
        mockfs.restore();
      });

      it('simple use', ()=>{
        var def = new MockResponseDef();
        def.content = file('/testfile');
        expect(def.content('/hoge', {userId: 17893001, userName:"山田太郎"}, {})).to.be.equal('{"user_id": 17893001, "user_name": "山田太郎"}');
      });

      it('change file contents', ()=>{
        var def = new MockResponseDef();
        def.content = file('/testfile');
        expect(def.content('/hoge', {userId: 17893001, userName:"山田太郎"}, {})).to.be.equal('{"user_id": 17893001, "user_name": "山田太郎"}');

        mockfs({'/testfile':'{"user_id": ${params.userId}, "user_name": "${params.userName}(元)"}'});
        expect(def.content('/hoge', {userId: 17893001, userName:"山田太郎"}, {})).to.be.equal('{"user_id": 17893001, "user_name": "山田太郎(元)"}');
      });
    });

  });

  describe('condition', ()=>{
    it('complex condition(true)', ()=>{
      var def = new MockResponseDef();
      def.condition = "path.startsWith('/users') \n&& (params.userId == 3939)"
      expect(def.condition('/users/3939', {userId:3939}, {})).to.be.true;
    });

    it('complex condition(false)', ()=>{
      var def = new MockResponseDef();
      def.condition = "path.startsWith('/users') \n&& (params.userId == 3939)"
      expect(def.condition('/users/3939', {userId:'hoge'}, {})).to.be.false;
    });
  });

});