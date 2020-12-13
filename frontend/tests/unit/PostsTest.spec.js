import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('Exactly as many posts are rendered as contained in testData.', function () {
        const postsRendered = wrapper.findAll('.post');
        expect(testData.length).toEqual(postsRendered.length);
    });
});

describe('Media', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('Media properties are rendered correctly based on type.', function () {
        const posts = wrapper.findAll('.post');

        for (let i = 0; i < posts.length; i++) {
            let post = posts.at(i);
            if (post.html().includes('post-image')) {
                post = post.find('.post-image')
                if (post.html().includes('img'))
                    expect(testData[i].media.type).toEqual('image')
                else if (post.html().includes('video'))
                    expect(testData[i].media.type).toEqual('video')
            } else
                expect(testData[i].media).toEqual(null)

        }
    });
});

describe('Date', () => {

    const wrapper = mount(Posts, { router, store, localVue });

    const moment = require('moment');
    it('Post create time should be displayed in the correct format.', () => {
        for (let i = 0; i < testData.length; i++) {
            const postDate = wrapper.find('.post-author > small').text();
            const testDate = moment(testData[i].createTime).format('LLLL');
            expect(postDate).toEqual(testDate);
        }
    });
});