import org.tmt.sbt.docs.Settings
import org.tmt.sbt.docs.DocKeys._

lazy val githubRepoUrl = "https://github.com/your-username/your-project"

ThisBuild / scalaVersion := "2.13.8"
ThisBuild / organizationName := "TMT Org"
ThisBuild / docsRepo := githubRepoUrl
ThisBuild / docsParentDir := ""
ThisBuild / gitCurrentRepo := githubRepoUrl

ThisBuild / version := "0.1.0"

lazy val openSite =
  Def.setting {
    Command.command("openSite") { state =>
      val uri = s"file://${Project.extract(state).get(siteDirectory)}/${docsParentDir.value}/${version.value}/index.html"
      state.log.info(s"Opening browser at $uri ...")
      java.awt.Desktop.getDesktop.browse(new java.net.URI(uri))
      state
    }
  }

/* ================= Paradox Project ============== */
lazy val `docs` = project
  .in(file("."))
  .enablePlugins(GithubPublishPlugin, ParadoxMaterialSitePlugin)
  .settings(
    commands += openSite.value,
    Settings.makeSiteMappings()
  )
