import { prisma } from "../../../prisma/prisma-client";

const News = async () => {

    const users = await prisma.user.findMany();

    return (
        <div>
            <h1>NEWS!</h1>
            <div>
                {users.map(user => {
                    return <label key={user.id}>{user.firstName}</label>
                })}
            </div>
        </div>
    );
};

export default News;