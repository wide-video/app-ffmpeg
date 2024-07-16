import * as BlobUtil from "~util/BlobUtil";
import * as ContentType from "common/util/ContentType";

// https://issues.chromium.org/issues/40921769
export const makeEmbeddable = (blob:Blob) =>
	blob.type === ContentType.MAP.mkv ? BlobUtil.toBlob(blob, ContentType.MAP.webm) : blob;