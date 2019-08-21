# Pull Request ID
export BC_PR_ID="${BC_PR_ID:-${CI_PULL_REQUEST##*/}}";

REPO=$CI_PULL_REQUEST;
REPO=${REPO##https://github.com/};
REPO=${REPO%%/pull/$BC_PR_ID};

# Repo Slug
export BC_REPO_SLUG=$REPO;

# Remember to put GITHUB_TOKEN in your ci env variables
REPOS_VALUES=($(curl -H "Authorization: token $GITHUB_TOKEN" -sSL https://api.github.com/repos/$BC_REPO_SLUG/pulls/$BC_PR_ID | jq -r -c ".head.repo.full_name, .head.repo.owner.login, .base.ref, .head.ref"));

# Pull request base branch (usually master)
export BC_PR_BASE_BRANCH=${REPOS_VALUES[2]};

# Pull request branch (branch to be merged into the base branch)
export BC_PR_BRANCH=${REPOS_VALUES[3]};

# LOGS
# echo "---- Extra variables created ----";
# echo "BC_REPO_SLUG $BC_REPO_SLUG";
# echo "BC_PR_BASE_BRANCH $BC_PR_BASE_BRANCH";
# echo "BC_PR_BRANCH $BC_PR_BRANCH";
# echo "---- Extra variables created ----";
