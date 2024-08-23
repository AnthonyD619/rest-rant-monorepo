import express, { Request, Response, Router } from 'express';
import { Place, Comment, User } from '../models'; // Adjust the import according to your models setup

const router: Router = express.Router();

interface CustomRequest extends Request {
  body: {
    pic?: string;
    city?: string;
    state?: string;
    rant?: boolean;
    authorId?: number;
    [key: string]: any; // To accommodate other dynamic properties
  };
  params: {
    placeId: string;
    commentId?: string;
  };
}

router.post('/', async (req: CustomRequest, res: Response) => {
  if (!req.body.pic) {
    req.body.pic = 'http://placekitten.com/400/400';
  }
  if (!req.body.city) {
    req.body.city = 'Anytown';
  }
  if (!req.body.state) {
    req.body.state = 'USA';
  }
  try {
    const place = await Place.create(req.body);
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Error creating place', error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const places = await Place.findAll();
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving places', error });
  }
});

router.get('/:placeId', async (req: CustomRequest, res: Response) => {
  const placeId = Number(req.params.placeId);
  if (isNaN(placeId)) {
    res.status(404).json({ message: `Invalid id "${placeId}"` });
  } else {
    try {
      const place = await Place.findOne({
        where: { placeId: placeId },
        include: {
          association: 'comments',
          include: 'author'
        }
      });
      if (!place) {
        res.status(404).json({ message: `Could not find place with id "${placeId}"` });
      } else {
        res.json(place);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving place', error });
    }
  }
});

router.put('/:placeId', async (req: CustomRequest, res: Response) => {
  const placeId = Number(req.params.placeId);
  if (isNaN(placeId)) {
    res.status(404).json({ message: `Invalid id "${placeId}"` });
  } else {
    try {
      const place = await Place.findOne({ where: { placeId: placeId } });
      if (!place) {
        res.status(404).json({ message: `Could not find place with id "${placeId}"` });
      } else {
        Object.assign(place, req.body);
        await place.save();
        res.json(place);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating place', error });
    }
  }
});

router.delete('/:placeId', async (req: CustomRequest, res: Response) => {
  const placeId = Number(req.params.placeId);
  if (isNaN(placeId)) {
    res.status(404).json({ message: `Invalid id "${placeId}"` });
  } else {
    try {
      const place = await Place.findOne({ where: { placeId: placeId } });
      if (!place) {
        res.status(404).json({ message: `Could not find place with id "${placeId}"` });
      } else {
        await place.destroy();
        res.json(place);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting place', error });
    }
  }
});

router.post('/:placeId/comments', async (req: CustomRequest, res: Response) => {
  const placeId = Number(req.params.placeId);
  req.body.rant = req.body.rant ? true : false;

  try {
    const place = await Place.findOne({ where: { placeId: placeId } });
    if (!place) {
      return res.status(404).json({ message: `Could not find place with id "${placeId}"` });
    }

    const author = await User.findOne({ where: { userId: req.body.authorId } });
    if (!author) {
      return res.status(404).json({ message: `Could not find author with id "${req.body.authorId}"` });
    }

    const comment = await Comment.create({ ...req.body, placeId: placeId });
    res.send({ ...comment.toJSON(), author });
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error });
  }
});

router.delete('/:placeId/comments/:commentId', async (req: CustomRequest, res: Response) => {
  const placeId = Number(req.params.placeId);
  const commentId = Number(req.params.commentId);

  if (isNaN(placeId)) {
    res.status(404).json({ message: `Invalid id "${placeId}"` });
  } else if (isNaN(commentId)) {
    res.status(404).json({ message: `Invalid id "${commentId}"` });
  } else {
    try {
      const comment = await Comment.findOne({
        where: { commentId: commentId, placeId: placeId }
      });
      if (!comment) {
        res.status(404).json({ message: `Could not find comment with id "${commentId}" for place with id "${placeId}"` });
      } else {
        await comment.destroy();
        res.json(comment);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error });
    }
  }
});

export default router;
