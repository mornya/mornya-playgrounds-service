import BaseController from 'controllers/BaseController';

export default class SampleController extends BaseController {
  constructor(router, { Sample }) {
    super();

    this.router = router;
    this.router.get('/samples', /*this.authorize('READER'),*/ this.selectSamples);
    this.router.get('/sample/:id', this.authorize('READER'), this.selectSampleById);
    this.router.post('/sample', this.authorize('WRITER'), this.insertSample);
    this.router.put('/sample/:id', this.authorize('WRITER'), this.updateSample);
    this.router.delete('/sample/:id', this.authorize('WRITER'), this.deleteSample);

    this.SampleModel = Sample;
  }

  selectSamples = (req, res) => {
    this.SampleModel.findAll()
      .then((list) => res.send(list))
      .catch((err) => this.sendResponseException(res, err));
  };

  selectSampleById = (req, res) => {
    this.SampleModel.find({ _id: req.params.id })
      .then((sample) => res.send(sample))
      .catch((err) => this.sendResponseException(res, err));
  };

  insertSample = (req, res) => {
    this.SampleModel.create(req.body)
      .then((sample) => res.send(sample))
      .catch((err) => this.sendResponseException(res, err));
  };

  updateSample = (req, res) => {
    this.SampleModel.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then((sample) => res.send(sample))
      .catch((err) => this.sendResponseException(res, err));
  };

  deleteSample = (req, res) => {
    this.SampleModel.remove({ _id: req.params.id })
      .then((sample) => res.send(sample))
      .catch((err) => this.sendResponseException(res, err));
  };
}
