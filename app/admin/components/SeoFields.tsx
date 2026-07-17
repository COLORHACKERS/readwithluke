type SeoFieldsProps = {
  seoTitle: string;
  setSeoTitle: (value: string) => void;

  seoDescription: string;
  setSeoDescription: (value: string) => void;

  seoImageUrl: string;
  setSeoImageUrl: (value: string) => void;

  seoNoindex: boolean;
  setSeoNoindex: (value: boolean) => void;

  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
};

export default function SeoFields({
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  seoImageUrl,
  setSeoImageUrl,
  seoNoindex,
  setSeoNoindex,
  fallbackTitle = "",
  fallbackDescription = "",
  fallbackImage = "",
}: SeoFieldsProps) {
  const previewTitle = seoTitle.trim() || fallbackTitle || "Page title";
  const previewDescription =
    seoDescription.trim() ||
    fallbackDescription ||
    "The page description will appear here.";

  const previewImage =
    seoImageUrl.trim() ||
    fallbackImage ||
    "/images/6to5ratio.png";

  return (
    <section className="adminSeoSection">
      <div className="adminSeoHeading">
        <div>
          <span className="adminSeoEyebrow">SEARCH &amp; SHARING</span>
          <h2>SEO Settings</h2>
        </div>

        <span className="adminSeoOptional">Optional</span>
      </div>

      <p className="adminSeoIntro">
        Customize how this post appears in Google search results and when
        shared on social media. Empty fields will use the regular title,
        description, and cover image.
      </p>

      <div className="adminSeoGrid">
        <label className="adminField">
          <span>SEO Title</span>

          <input
            type="text"
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
            placeholder={fallbackTitle || "Search result title"}
            maxLength={70}
          />

          <small className={seoTitle.length > 60 ? "seoWarning" : ""}>
            {seoTitle.length}/70 characters
          </small>
        </label>

        <label className="adminField adminSeoDescriptionField">
          <span>Meta Description</span>

          <textarea
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            placeholder={
              fallbackDescription ||
              "Describe this page for search engines."
            }
            maxLength={180}
            rows={4}
          />

          <small
            className={seoDescription.length > 160 ? "seoWarning" : ""}
          >
            {seoDescription.length}/180 characters
          </small>
        </label>

        <label className="adminField">
          <span>Social Share Image URL</span>

          <input
            type="url"
            value={seoImageUrl}
            onChange={(event) => setSeoImageUrl(event.target.value)}
            placeholder={fallbackImage || "https://..."}
          />

          <small>
            Leave blank to use the post cover image.
          </small>
        </label>

        <label className="adminSeoCheckbox">
          <input
            type="checkbox"
            checked={seoNoindex}
            onChange={(event) => setSeoNoindex(event.target.checked)}
          />

          <span>
            <strong>Hide from search engines</strong>
            <small>
              Use this for drafts, private pages, or content you do not want
              appearing in Google.
            </small>
          </span>
        </label>
      </div>

      <div className="adminSeoPreview">
        <span className="adminSeoPreviewLabel">
          Search Preview
        </span>

        <div className="adminSeoPreviewContent">
          <img src={previewImage} alt="" />

          <div>
            <small>readwithluke.com</small>
            <h3>{previewTitle}</h3>
            <p>{previewDescription}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
