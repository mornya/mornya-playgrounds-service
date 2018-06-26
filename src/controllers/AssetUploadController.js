import fs from 'fs-extra';
import multer from 'multer';
import path from 'path';
import BaseController from 'controllers/BaseController';
import { getUID } from 'utils/Text';

export default class AssetUploadController extends BaseController {
  constructor(router, { AssetUpload }) {
    super();

    this.router = router;
    this.router.post('/assetUpload', multer({ storage: this.getStorage() }).single('file[]'), this.assetUpload);
    this.router.get('/assetFiles/:userId/:groupName', /*this.authorize('WRITER'),*/ this.getAssetFiles);
    this.router.post('/assetFiles', /*this.authorize('WRITER'),*/ this.postAssetFiles);
    this.router.delete('/assetFiles/:userId/:groupName', /*this.authorize('WRITER'),*/ this.deleteAssetFiles);

    this.assetUploadModel = AssetUpload;
  }

  /**
   * 업로드 미들웨어 설정
   *
   * @return {*|DiskStorage}
   */
  getStorage = () =>
    multer.diskStorage({
      destination: (req, file, cb) => {
        // 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
        const currDate = new Date();
        const year = currDate.getYear() + 1900;
        const month = currDate.getMonth() < 10 ? `0${(currDate.getMonth() + 1)}` : String(currDate.getMonth());
        const basePath = path.resolve(process.env.PATH_UPLOADS, `${year}${month}`);
        if (!fs.pathExistsSync(basePath)) {
          fs.mkdirsSync(basePath);
        }
        cb(null, basePath);
      },
      filename: (req, file, cb) => {
        // 콜백함수를 통해 전송된 파일 이름 설정
        cb(null, `${getUID()}-${file.originalname}`);
      },
    });

  /**
   * 파일 업로드 실행
   *
   * @param req
   * @param res
   */
  assetUpload = (req, res) => {
    if (req.file) {
      const { URL_ORIGIN_ASSETS, PATH_UPLOADS } = process.env;
      const { originalname, encoding, mimetype, filename, size } = req.file;
      const pathIndex = req.file.path.lastIndexOf(PATH_UPLOADS) + PATH_UPLOADS.length + 1;
      const restPath = req.file.path.substring(pathIndex);
      this.sendResponse(res, {
        url: `${URL_ORIGIN_ASSETS}/${restPath}`,
        physicalName: restPath,
        originalName: originalname,
        fileName: filename,
        size,
        encoding,
        mimeType: mimetype,
      });
    } else {
      this.sendResponseError(res, this.responseCodes.ASSET_UPLOAD_FAIL);
    }
  };

  /**
   * DB에 저장된 전체 파일 정보를 불러 옴
   *
   * @param req
   * @param res
   */
  getAssetFiles = (req, res) => {
    const { userId, groupName } = req.params;

    if (userId && groupName) {
      this.assetUploadModel.findOne({ userId, groupName })
        .then((resultData) => this.sendResponse(res, { files: resultData.files }))
        .catch((err) => this.sendResponseException(res, err));
    } else {
      this.sendResponseError(res, this.responseCodes.HTTP_404);
    }
  };

  /**
   * 업로드 된 파일(들) 전체에 대한 정보를 DB 저장
   *
   * @param req
   * @param res
   */
  postAssetFiles = (req, res) => {
    if (req.body) {
      const { userId, groupName, files } = req.body;

      this.assetUploadModel.findOne({ userId, groupName })
        .then((resultData) => {
          const currDate = new Date();
          const nextFiles = files.map((item) => {
            item.createdAt = currDate;
            item.updatedAt = currDate;
            return item;
          });

          if (!resultData) {
            // Insert new file data
            return this.assetUploadModel.create({ userId, groupName, files: nextFiles });
          } else {
            // Update file data
            return this.assetUploadModel.update({ userId, groupName }, { $push: { files: nextFiles } });
          }
        })
        .then((resultData) => this.sendResponse(res, resultData))
        .catch((err) => this.sendResponseException(res, err));
    } else {
      this.sendResponseError(res, this.responseCodes.HTTP_404);
    }
  };

  /**
   * DB에 저장된 파일 삭제 (실제 파일은 유지)
   *
   * @param req
   * @param res
   */
  deleteAssetFiles = (req, res) => {
    const userId = req.params.userId;
    const groupName = req.params.groupName;
    const fileIds = req.body.fileIds;

    if (userId && groupName) {
      this.assetUploadModel.remove({ userId, groupName, files: { $in: fileIds } })
        .then((resultData) => this.sendResponse(res, resultData))
        .catch((err) => this.sendResponseException(res, err));
    } else {
      this.sendResponseError(res, this.responseCodes.HTTP_404);
    }
  };
}
