import path from "path";
import AdmZip from "adm-zip";
import { promises as fs } from "fs";

export interface Package {
    title: string;
    version: string;
    minimum_game_version: string;
    content_type: "SCENERY" | "AIRCRAFT" | "unknown";
    rootPath: string;
}

export type PreviewResult =
    | {
          result: "too_large";
          path: string;
      }
    | {
          result: "success";
          content: AdmZip;
          path: string;
          packages: Package[];
      };

export class ArchiveManager {
    public preview = async (file: File): Promise<PreviewResult> => {
        if (file.size > 300 * 1024 * 1024) {
            return { result: "too_large", path: file.path };
        }

        return new Promise((resolve) => {
            const zip = new AdmZip(file.path);

            const manifests = zip.getEntries().filter((x) => x.name === "manifest.json");

            const result: PreviewResult = {
                result: "success",
                content: zip,
                path: file.path,
                packages: []
            };

            const zipFileName = path.basename(file.name, path.extname(file.name));

            manifests.forEach((m, i) => {
                m.getDataAsync((mdata) => {
                    const json = JSON.parse(mdata.toString("utf-8"));
                    let pkgName = path.basename(path.dirname(m.entryName));
                    if (pkgName === ".") {
                        pkgName = manifests.length > 1 ? `${zipFileName}_${i}` : zipFileName;
                    }

                    const pkg: Package = {
                        title: json.title || pkgName,
                        content_type: json.content_type,
                        version: json.package_version,
                        minimum_game_version: json.minimum_game_version,
                        rootPath: path.dirname(m.entryName)
                    };

                    result.packages.push(pkg);
                    if (result.packages.length === manifests.length) {
                        resolve(result);
                    }
                });
            });
        });
    };

    public unpack = async (file: PreviewResult): Promise<void> => {
        if (file.result === "too_large") {
            console.error("Not handling large files yet");
            throw "not ready for that yet";
        }

        if (file.packages.length === 0) {
            console.error(file.path, "does not contain any packages");
        }

        const config = await window.configurationManager.getConfigurationAsync();
        const basePath = config.fsCommunitManagerPackagesDirectory;
        const zipFileName = path.basename(file.path, path.extname(file.path));
        const targetPath = path.join(basePath, zipFileName);

        console.log("extracting", file.path, "to", targetPath);
        await new Promise((resolve, reject) => {
            file.content.extractAllToAsync(targetPath, false, (error) => {
                if (error) {
                    console.log("extraction failed: ", error);
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        await Promise.all(
            file.packages.map((pkg) => {
                fs.symlink(path.join(targetPath, pkg.rootPath), path.join(config.msfsPackagesDirectory, pkg.title));
            })
        );
    };
}
