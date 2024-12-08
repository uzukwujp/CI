import mongoose from "mongoose"

// define Post interface
interface Post {
    title: string,
    comments: string[]
};

//extend mongoose document to include attributes of Todo interface

interface PostDoc extends mongoose.Document {
    title: string,
    comments: string[]
}

// extend mongoose model to add build method 
interface PostModel extends mongoose.Model<PostDoc>{
    build(Attr: Post):PostDoc
}


const postSchema = new mongoose.Schema<PostDoc>({
    title: {type: String, required: true},
    comments: [{type: String}]
})

postSchema.statics.build = (attr:Post) =>{
    return new Post(attr);
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export default Post;