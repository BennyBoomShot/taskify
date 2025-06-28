const router = require('express').Router();
const auth = require('../middleware/auth');
const boardController = require('../controllers/boardController');

router.post('/', auth, boardController.createBoard);
router.get('/', auth, boardController.getBoards);
router.delete('/:id', auth, boardController.deleteBoard);
router.put('/:id', auth, boardController.updateBoard);

module.exports = router;