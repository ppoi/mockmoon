import { expect } from 'chai';
import mockfs from 'mock-fs';
import { MockResponseDef, file } from '../src/mockdef';

describe('MockResponseDef', ()=>{

  describe('content', ()=>{
    describe('inline contents', ()=>{
      it('simple use', ()=>{
        var def = new MockResponseDef();
        def.content = "user_id = ${ params.user_id }. OK?";
        let path = ('/users/39');
        let headers = {};
        let cookies = [];
        let params = {user_id:39};
        let query = {};
        let data = undefined;
        expect(def.content(path, headers, cookies, params, query, data)).to.be.equal("user_id = 39. OK?");
      });
    });

    describe('file contents', ()=>{
      beforeEach(()=>{
        mockfs({'/testfile':'{"user_id": ${params.user_id}, "user_name": "${query.user_name}"}'});
      });
      afterEach(()=>{
        mockfs.restore();
      });

      it('simple use', ()=>{
        var def = new MockResponseDef();
        def.content = file('/testfile');
        let path = ('/users/17893001');
        let headers = {};
        let cookies = [];
        let params = {user_id:17893001};
        let query = {user_id: 17893001, user_name: "山田太郎"};
        let data = undefined;
        expect(def.content(path, headers, cookies, params, query, data)).to.be.equal('{"user_id": 17893001, "user_name": "山田太郎"}');
      });

      it('change file contents', ()=>{
        var def = new MockResponseDef();
        def.content = file('/testfile');
        let path = ('/users/17893001');
        let headers = {};
        let cookies = [];
        let params = {user_id:17893001};
        let query = {user_id: 17893001, user_name: "山田次郎"};
        let data = undefined;
        expect(def.content(path, headers, cookies, params, query, data)).to.be.equal('{"user_id": 17893001, "user_name": "山田次郎"}');

        mockfs({'/testfile':'{"user_id": ${params.user_id}, "user_name": "${query.user_name}(改)"}'});
        expect(def.content(path, headers, cookies, params, query, data)).to.be.equal('{"user_id": 17893001, "user_name": "山田次郎(改)"}');
      });
    });

  });

  describe('condition', ()=>{
    it('complex condition(true)', ()=>{
      var def = new MockResponseDef();
      def.condition = "path.startsWith('/users') \n&& (params.user_id == 3939)"
      let path = ('/users/3939');
      let headers = {};
      let cookies = [];
      let params = {user_id:3939};
      let query = {};
      let data = undefined;
    expect(def.condition(path, headers, cookies, params, query, data)).to.be.true;
    });

    it('complex condition(false)', ()=>{
      var def = new MockResponseDef();
      def.condition = "path.startsWith('/users') \n&& (params.userId == 3939)"
      let path = ('/users/3939');
      let headers = {};
      let cookies = [];
      let params = {user_id:'hoge'};
      let query = {};
      let data = undefined;
      expect(def.condition(path, headers, cookies, params, query, data)).to.be.false;
    });
  });

});