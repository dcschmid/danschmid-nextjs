import directus from "../../lib/directus";

const handler = async (req, res) => {
  const { collection } = req.body;

  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (collection === "Blog") {
    const { keys } = req.body;

    for (const key of keys) {
      const directusRes = await directus
        .items(collection)
        .readOne(key, { fields: ["slug"] });

      await res.revalidate(`/${directusRes.slug}`);
      return res.json({ revalidated: true });
    }
  }

  return res.status(200).send("Success");
};

export default handler;
