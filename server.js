const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {
        GraphQLSchema,
        GraphQLObjectType,
        GraphQLList,
        GraphQLInt,
        GraphQLString,
        GraphQLNonNull
} = require('graphql');
const app = express();

const authors = [
        {id:1 , name: "J K Rowling"},
        {id:2 , name: "J R R Tolkien"},
        {id:3 , name: "Brent Weeks"}
]

const books = [
        {id: 1, name: "Harry Potter and the Chamber of secrets", authorId: 1},
        {id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1},
        {id: 3, name: "Harry Potter and the Goblet of fire", authorId: 1},
        {id: 4, name: "The fellow ship of the ring", authorId: 2},
        {id: 5, name: "The two towers", authorId: 2},
        {id: 6, name: "The return of the king", authorId: 2},
        {id: 7, name: "The way of shadows", authorId: 3},
        {id: 8, name: "Beyond the shadows", authorId: 3}
];

const AuthorType = new GraphQLObjectType({
        name : 'Author',
        description : 'This represents a Author of a book',
        fields : ()=>({
                id      : {   type : GraphQLNonNull(GraphQLInt)},
                name    : {   type : GraphQLNonNull(GraphQLString)},
                books    : {   
                        type : GraphQLList(BookType),
                        resolve : (author) => {
                                return books.filter(book => book.authorId === author.id);
                        }
                }
        })
});

const BookType = new GraphQLObjectType({
        name : 'Book',
        description : 'This represents a book written by author',
        fields : ()=>({
                id      : {   type : GraphQLNonNull(GraphQLInt)},
                name    : {   type : GraphQLNonNull(GraphQLString)},
                authorId: {   type : GraphQLNonNull(GraphQLInt)},
                author  : {   
                        type : AuthorType,
                        resolve : (book) => { // resolve function takes the parent and args as param
                                return authors.find( author => author.id === book.authorId);
                        }
                }
        })
});


const RootQueryType = new GraphQLObjectType({
        name : 'Query',
        description : "This is the root query",
        fields : () => ({
                book: {
                        type: BookType,
                        description : 'A Single Book',
                        args : {
                                id : { type: GraphQLInt}
                        },
                        resolve : (parent, args) => books.find(book => book.id === args.id)
                },
                books: {
                        type: new GraphQLList(BookType),
                        description : 'List of books',
                        resolve : () => books
                },
                authors: {
                        type: new GraphQLList(AuthorType),
                        description : 'List of Authors',
                        resolve : () => authors
                },
                author: {
                        type: AuthorType,
                        description : 'List of Authors',
                        args : {
                                id : { type: GraphQLInt}
                        },
                        resolve : (parent, args) => authors.find(author => author.id === args.id)
                }
        })
});

const schema = new GraphQLSchema({
        query: RootQueryType
});
app.use('/graphql', graphqlHTTP({
        schema : schema,
        graphiql : true
}));
app.listen(5000, ()=> console.log("server running"));
