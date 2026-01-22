if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then
  # Proceed with the build
  exit 1;
else
  # Don't build
  exit 0;
fi
